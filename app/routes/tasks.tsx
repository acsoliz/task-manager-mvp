// app/routes/tasks.tsx
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useFetcher } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Typography, Button, Modal, message } from "antd";
import type { Task } from "@prisma/client";
import { TaskForm, TaskList } from "~/components";
import React, { useEffect, useState } from "react";

interface LoaderData {
    tasks: Task[];
}

const { Title } = Typography;

// Función `loader`: Se ejecuta en el servidor para obtener los datos
export const loader: LoaderFunction = async () => {
    const tasks = await db.task.findMany();
    return {
        tasks: tasks.map((task) => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        })),
    };
};

// Función `action`: También se ejecuta en el servidor, manejando los cambios de datos
export const action: ActionFunction = async ({ request }) => {
    console.log('en crear tarea, request:::', request);
    
    const formData = new URLSearchParams(await request.text());
    const title = formData.get("title") || "";
    const description = formData.get("description") || "";
    let priority: string | null = formData.get("priority");

    // Convertir priority a número, o 0 si no existe
    const priorityNumber: number = priority ? Number(priority) : 0;

    console.log('tarea creada::::', { title, description, priority: priorityNumber });
    
    if (title) {
        await db.task.create({
            data: { 
                title, 
                description, 
                priority: priorityNumber // Guardamos priority como número o null
            }
        });
    }

    // Redirige con el parámetro success
    return redirect("/tasks?success=true");
};

export default function Tasks() {
    const { tasks } = useLoaderData<LoaderData>();
    const fetcher = useFetcher<LoaderData>(); 

    // Estado para controlar el modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Para obtener la URL y revisar el parámetro
    const location = useLocation();

    // Detecta el parámetro success y muestra un mensaje
    useEffect(() => {
        if (new URLSearchParams(location.search).get("success") === "true") {
            message.success("¡Tarea creada con éxito!");
        }
    }, [location]);

    // Funciones para abrir y cerrar el modal
    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    // Función para recargar la lista de tareas al eliminar
    const handleTaskDeleted = async () => {
        fetcher.load("/tasks");
    };


    return (
        <div className="p-6 flex flex-col items-center">
            <Title level={2}>Gestión de Tareas</Title>
            <Button type="primary" onClick={showModal} className="mb-4">
                Crear Nueva Tarea
            </Button>

            {/* Modal para crear una nueva tarea */}
            <Modal
                title="Nueva Tarea"
                open={isModalVisible}
                onCancel={closeModal}
                footer={null} // Quitamos los botones de footer ya que están dentro de TaskForm
            >
                <TaskForm onClose={closeModal} /> {/* Agregamos la función onClose */}
            </Modal>

            <TaskList tasks={fetcher.data?.tasks || tasks} onTaskDeleted={handleTaskDeleted} />
        </div>
    );
}
