import { ProjectList } from "@/components/project/ProjectList";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 p-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Project
            </Button>
          </div>
          
          <ProjectList />
          <ProjectFormModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </main>
    </div>
  );
};

export default Projects;