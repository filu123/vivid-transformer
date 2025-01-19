import { ProjectList } from "@/components/project/ProjectList";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="w-full p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
  );
};

export default Projects;