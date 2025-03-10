
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Your invitation management at a glance
            </p>
          </div>
          
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
