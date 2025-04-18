require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client with your existing API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testWebSearchCapability() {
  console.log('Creating temporary test assistant with web browsing capability...');
  
  try {
    // Create a temporary test assistant
    const assistant = await openai.beta.assistants.create({
      name: "TEST_WEB_SEARCH_ASSISTANT",
      instructions: "You are a temporary test assistant to verify web search capability.",
      model: "gpt-4-turbo", // or gpt-4o if available
      tools: [{ type: "web_search" }]
    });
    
    console.log('Test assistant created successfully!');
    console.log(`Assistant ID: ${assistant.id}`);
    console.log('Tools enabled:', assistant.tools.map(tool => tool.type));
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    console.log(`Thread created: ${thread.id}`);
    
    // Add a message requiring web search
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "What are the latest developments in non-dual teachings? Please search the web for recent information."
    });
    
    // Run the assistant
    console.log('Running the assistant with web search query...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });
    
    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log(`Initial run status: ${runStatus.status}`);
    
    // Wait for completion (simple polling)
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      console.log(`Run status: ${runStatus.status}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    console.log(`Final run status: ${runStatus.status}`);
    
    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Print the assistant's response
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
      console.log('\nAssistant response:');
      console.log(assistantMessages[0].content[0].text.value);
      
      // Check if web search was used
      if (runStatus.status === 'completed' && 
          assistantMessages[0].content[0].text.value.includes('search') || 
          assistantMessages[0].content[0].text.value.includes('found')) {
        console.log('\n✅ Web search capability appears to be working!');
      } else {
        console.log('\n❌ Web search may not be working properly.');
      }
    }
    
    // Cleanup - delete the test assistant
    console.log('\nCleaning up - deleting test assistant...');
    await openai.beta.assistants.del(assistant.id);
    console.log('Test assistant deleted successfully.');
    
  } catch (error) {
    console.error('Error testing web search capability:', error);
    if (error.message.includes('not authorized') || error.message.includes('permission')) {
      console.log('\n❌ Your account does not have access to web search capability yet.');
    }
  }
}

// Run the test
testWebSearchCapability();
