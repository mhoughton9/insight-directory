/**
 * AI Generation Controller
 * 
 * Handles API requests for generating resource, teacher, and tradition descriptions using OpenAI
 */

const OpenAI = require('openai');
const Resource = require('../models/resource');
const Teacher = require('../models/teacher');
const Tradition = require('../models/tradition');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate descriptions for a resource using OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateDescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionKeys } = req.body;
    
    if (!sectionKeys || !Array.isArray(sectionKeys) || sectionKeys.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section keys must be provided as an array' 
      });
    }
    
    // Fetch the resource from the database
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }
    
    // Prepare resource data for the AI
    const resourceData = prepareResourceData(resource, sectionKeys);
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Please generate content for the following resource:\n${JSON.stringify(resourceData, null, 2)}`
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.INSIGHT_ASSISTANT_ID
    });
    
    // Poll for completion
    const completedRun = await waitForRunCompletion(thread.id, run.id);
    
    if (completedRun.status !== 'completed') {
      console.error('OpenAI run failed:', completedRun);
      
      // Check if there are any errors in the run
      let errorMessage = `Run ended with status: ${completedRun.status}`;
      
      if (completedRun.last_error) {
        errorMessage += ` - ${completedRun.last_error.code}: ${completedRun.last_error.message}`;
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage,
        runDetails: completedRun
      });
    }
    
    // Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'No response from AI assistant' 
      });
    }
    
    // Parse the JSON response
    const responseContent = assistantMessages[0].content[0].text.value;
    let generatedSections;
    
    try {
      generatedSections = JSON.parse(responseContent);
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse AI response as JSON',
        error: error.message,
        rawResponse: responseContent
      });
    }
    
    return res.json({ 
      success: true, 
      generatedSections 
    });
  } catch (error) {
    console.error('Error generating descriptions:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while generating descriptions' 
    });
  }
};

/**
 * Prepare resource data for the AI request
 * @param {Object} resource - The resource document from MongoDB
 * @param {Array} sectionKeys - The section keys to generate content for
 * @returns {Object} - Formatted resource data for the AI
 */
const prepareResourceData = (resource, sectionKeys) => {
  // Start with basic resource data
  const data = {
    type: resource.type,
    title: resource.title,
    description: resource.description,
    sectionKeys: sectionKeys,
  };
  
  // Add creator if available
  if (resource.creator && resource.creator.length > 0) {
    data.creator = resource.creator;
  }
  
  // Add published date if available
  if (resource.publishedDate) {
    data.publishedDate = resource.publishedDate;
  }
  
  // Add type-specific details based on resource type
  const typeDetailsField = `${resource.type.toLowerCase()}Details`;
  if (resource[typeDetailsField]) {
    data.typeSpecificDetails = resource[typeDetailsField];
  }
  
  return data;
};

/**
 * Wait for an OpenAI run to complete
 * @param {string} threadId - The thread ID
 * @param {string} runId - The run ID
 * @param {number} maxAttempts - Maximum number of polling attempts
 * @returns {Object} - The completed run
 */
const waitForRunCompletion = async (threadId, runId, maxAttempts = 30) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    
    console.log(`Run status (attempt ${attempts + 1}/${maxAttempts}):`, run.status);
    
    if (run.status === 'completed' || 
        run.status === 'failed' || 
        run.status === 'cancelled' || 
        run.status === 'expired') {
      
      // If the run failed, try to get more information
      if (run.status === 'failed') {
        console.error('Run failed with details:', JSON.stringify(run, null, 2));
        
        // Try to get the run steps for more information
        try {
          const runSteps = await openai.beta.threads.runs.steps.list(threadId, runId);
          console.error('Run steps:', JSON.stringify(runSteps.data, null, 2));
        } catch (error) {
          console.error('Error retrieving run steps:', error);
        }
      }
      
      return run;
    }
    
    // Wait before checking again (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Run timed out');
};
/**
 * Generate descriptions for a teacher using OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateTeacherDescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionKeys } = req.body;
    
    if (!sectionKeys || !Array.isArray(sectionKeys) || sectionKeys.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section keys must be provided as an array' 
      });
    }
    
    // Fetch the teacher from the database
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }
    
    // Prepare teacher data for the AI
    const teacherData = prepareTeacherData(teacher, sectionKeys);
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Please generate content for the following teacher:
${JSON.stringify(teacherData, null, 2)}`
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.TEACHER_ASSISTANT_ID
    });
    
    // Poll for completion
    const completedRun = await waitForRunCompletion(thread.id, run.id);
    
    if (completedRun.status !== 'completed') {
      console.error('OpenAI run failed:', completedRun);
      
      // Check if there are any errors in the run
      let errorMessage = `Run ended with status: ${completedRun.status}`;
      
      if (completedRun.last_error) {
        errorMessage += ` - ${completedRun.last_error.code}: ${completedRun.last_error.message}`;
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage,
        runDetails: completedRun
      });
    }
    
    // Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'No response from AI assistant' 
      });
    }
    
    // Parse the JSON response
    const responseContent = assistantMessages[0].content[0].text.value;
    let generatedSections;
    
    try {
      generatedSections = JSON.parse(responseContent);
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse AI response as JSON',
        error: error.message,
        rawResponse: responseContent
      });
    }
    
    return res.json({ 
      success: true, 
      generatedSections 
    });
  } catch (error) {
    console.error('Error generating teacher descriptions:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while generating teacher descriptions' 
    });
  }
};

/**
 * Prepare teacher data for the AI request
 * @param {Object} teacher - The teacher document from MongoDB
 * @param {Array} sectionKeys - The section keys to generate content for
 * @returns {Object} - Formatted teacher data for the AI
 */
const prepareTeacherData = (teacher, sectionKeys) => {
  // Start with basic teacher data
  const data = {
    name: teacher.name,
    biography: teacher.biography,
    sectionKeys: sectionKeys,
  };
  
  // Add birth/death years if available
  if (teacher.birthYear) {
    data.birthYear = teacher.birthYear;
  }
  
  if (teacher.deathYear) {
    data.deathYear = teacher.deathYear;
  }
  
  // Add country if available
  if (teacher.country) {
    data.country = teacher.country;
  }
  
  return data;
};

/**
 * Generate descriptions for a tradition using OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateTraditionDescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionKeys } = req.body;
    
    if (!sectionKeys || !Array.isArray(sectionKeys) || sectionKeys.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section keys must be provided as an array' 
      });
    }
    
    // Fetch the tradition from the database
    const tradition = await Tradition.findById(id);
    if (!tradition) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tradition not found' 
      });
    }
    
    // Prepare tradition data for the AI
    const traditionData = prepareTraditionData(tradition, sectionKeys);
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Please generate content for the following tradition:
${JSON.stringify(traditionData, null, 2)}`
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.TRADITION_ASSISTANT_ID
    });
    
    // Poll for completion
    const completedRun = await waitForRunCompletion(thread.id, run.id);
    
    if (completedRun.status !== 'completed') {
      console.error('OpenAI run failed:', completedRun);
      
      // Check if there are any errors in the run
      let errorMessage = `Run ended with status: ${completedRun.status}`;
      
      if (completedRun.last_error) {
        errorMessage += ` - ${completedRun.last_error.code}: ${completedRun.last_error.message}`;
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage,
        runDetails: completedRun
      });
    }
    
    // Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'No response from AI assistant' 
      });
    }
    
    // Parse the JSON response
    const responseContent = assistantMessages[0].content[0].text.value;
    let generatedSections;
    
    try {
      generatedSections = JSON.parse(responseContent);
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse AI response as JSON',
        error: error.message,
        rawResponse: responseContent
      });
    }
    
    return res.json({ 
      success: true, 
      generatedSections 
    });
  } catch (error) {
    console.error('Error generating tradition descriptions:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while generating tradition descriptions' 
    });
  }
};

/**
 * Prepare tradition data for the AI request
 * @param {Object} tradition - The tradition document from MongoDB
 * @param {Array} sectionKeys - The section keys to generate content for
 * @returns {Object} - Formatted tradition data for the AI
 */
const prepareTraditionData = (tradition, sectionKeys) => {
  // Start with basic tradition data
  const data = {
    name: tradition.name,
    description: tradition.description,
    sectionKeys: sectionKeys,
  };
  
  // Add origin if available
  if (tradition.origin) {
    data.origin = tradition.origin;
  }
  
  // Add founding period if available
  if (tradition.foundingPeriod) {
    data.foundingPeriod = tradition.foundingPeriod;
  }
  
  return data;
};

module.exports = {
  generateDescriptions,
  generateTeacherDescriptions,
  generateTraditionDescriptions
};
