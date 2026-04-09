import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DemoSection from '@/components/DemoSection';
import ImpactSection from '@/components/ImpactSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero3D />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </main>
  );
}
