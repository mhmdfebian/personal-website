import Link from "next/link";

import { getAdminProjects } from "@/lib/api/admin/projects";

import { ProjectRowActions } from "@/components/admin/project-row-actions";

export default function AdminProjectsPage() {
  return <AdminProjectsContent />;
}

async function AdminProjectsContent() {
  const projects = await getAdminProjects();

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-black/50">CMS</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Projects</h1>
        </div>
        <Link className="bg-black px-4 py-2 text-sm font-medium text-white" href="/admin/projects/new">
          New project
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="border border-dashed border-black/20 px-6 py-12 text-black/60">
          No projects yet. Create the first one to populate the public portfolio.
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 bg-zinc-50 text-xs uppercase tracking-wide text-black/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-4 font-medium">{project.title}</td>
                  <td className="px-4 py-4 text-black/60">{project.slug}</td>
                  <td className="px-4 py-4">{project.isPublished ? "Yes" : "No"}</td>
                  <td className="px-4 py-4">{project.isFeatured ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-black/60">{project.createdAt.toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-black/60">{project.updatedAt.toLocaleDateString()}</td>
                  <td className="px-4 py-4"><ProjectRowActions id={project.id} isFeatured={project.isFeatured} isPublished={project.isPublished} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}