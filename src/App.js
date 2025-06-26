
import './App.css';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import ResumeUploader from './components/ResumeUploader';

function App() {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-800'>
      <Header />
      <main className='container mx-auto p-4'>
        <ResumeUploader />
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;
