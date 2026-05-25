import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Logo from '../components/Logo';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="px-6 lg:px-16 py-16 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Text */}
              <div className="w-full lg:max-w-xl space-y-5 text-center lg:text-left">
                <h5 className="text-sm tracking-widest text-yellow-500 font-medium">WE ARE HERE TO HELP YOU</h5>
                <h1 className="text-4xl font-bold text-gray-900">WELCOME TO EDUGRADE</h1>
                <p className="text-gray-600 leading-relaxed">
                  Master new skills with AI-driven learning paths, track your progress, and achieve your goals faster than ever before.
                </p>
                <Button title={"Get Started"} onClick={() => navigate('/login')} />
              </div>

              {/* Image */}
              <div className="relative hidden shadow-md lg:flex w-full lg:w-1/2 rounded-lg justify-end p-3 bg-white">
                <img 
                  src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg" 
                  alt="Learning" 
                  className='w-full rounded-lg object-cover' 
                />
                
                <div className="absolute -bottom-5 -left-5 shadow-xl bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 w-12 rounded-full overflow-hidden border-2 border-white">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-gray-800">
                    <span className="font-bold">10k+ </span>Students
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;