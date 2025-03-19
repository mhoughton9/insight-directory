import Link from 'next/link';

/**
 * Traditions and Teachers Section component for the home page
 * Displays traditions and teachers in a two-column layout
 * @param {Object} props - Component props
 * @param {Array} props.traditions - Array of tradition objects
 * @param {Array} props.teachers - Array of teacher objects
 * @param {Array} props.brandColors - Array of brand colors for styling
 */
const TraditionsTeachersSection = ({ traditions, teachers, brandColors }) => {
  return (
    <section className="py-16 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditions Column */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-medium mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-accent text-center" style={{ fontFamily: 'Lora, serif' }}>Traditions</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Array.isArray(traditions) && traditions.map((tradition, index) => {
                // Assign colors from brand palette based on index
                const color = brandColors[index % brandColors.length];
                
                return (
                  <div key={tradition._id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                    <Link 
                      href={`/traditions/${tradition._id}`}
                      className="text-neutral-800 dark:text-neutral-200 hover:text-accent dark:hover:text-accent transition-all duration-300 transform hover:translate-x-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tradition.name}
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link 
              href="/traditions" 
              className="inline-block mt-6 text-accent hover:underline font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All Traditions →
            </Link>
          </div>

          {/* Teachers Column */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-medium mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-accent text-center" style={{ fontFamily: 'Lora, serif' }}>Teachers</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Array.isArray(teachers) && teachers.map((teacher, index) => {
                // Assign colors from brand palette based on index
                const color = brandColors[index % brandColors.length];
                
                return (
                  <div key={teacher._id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                    <Link 
                      href={`/teachers/${teacher._id}`}
                      className="text-neutral-800 dark:text-neutral-200 hover:text-accent dark:hover:text-accent transition-all duration-300 transform hover:translate-x-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {teacher.name}
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link 
              href="/teachers" 
              className="inline-block mt-6 text-accent hover:underline font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All Teachers →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraditionsTeachersSection;
