// app/routes/tasks/$taskId.tsx
import { json, LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { TaskForm } from "~/components";
import type { Task as PrismaTask } from "@prisma/client";
import React from "react";

// Tipo para los datos de la tarea
type Task = Omit<PrismaTask, 'createdAt' | 'updatedAt'> & {
    createdAt: string | Date;
    updatedAt: string | Date;
};

// Loader para obtener la tarea actual
export const loader: LoaderFunction = async ({ params }) => {
    if (!params?.taskId) throw new Response("taskId is required::", { status: 401 })
    const taskId = Number(params.taskId);

    const task = await db.task.findUnique({
        where: { id: taskId }
    });

    if (!task) throw new Response("Tarea no encontrada", { status: 404 });

    return { task: { ...task, createdAt: task.createdAt.toISOString(), updatedAt: task.updatedAt.toISOString() } };
};

// Action para actualizar o eliminar la tarea
export const action: ActionFunction = async ({ request, params }) => {
    const taskId = Number(params.taskId);


    if (request.method === "PUT") {
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priority = Number(formData.get("priority"));
        const status = formData.get("status") as string;

        await db.task.update({
            where: { id: taskId },
            data: { title, description, priority, status: parseInt(status) },
        });
        return redirect("/tasks?success=edit");
    }

    if (request.method === "DELETE") {
        console.log('en el request.method:::::', request.method )
        console.log('en el taskId:::::', taskId )
        return await db.task.delete({
            where: { id: taskId }
        });
        
        // return redirect("/tasks?success=delete");

    }

    return null;
};

// Componente principal para mostrar el formulario
export default function TaskDetails() {
    const { task } = useLoaderData<{ task: Task }>();
    const navigate = useNavigate();

    // Cierra el modal al guardar o cancelar
    const handleClose = () => {
        navigate("/tasks");
    };

    return (
        <TaskForm task={task} onClose={handleClose} />
    );
}
