// app/components/TaskList.tsx
import React, { useState } from "react";
import type { Task as PrismaTask } from "@prisma/client";
import { Table, Tag, Button, Space, Popconfirm, Modal, message } from "antd";
import { CheckOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TaskForm } from "~/components";

type Task = Omit<PrismaTask, 'createdAt' | 'updatedAt'> & {
    createdAt: string | Date;
    updatedAt: string | Date;
};

interface TaskListProps {
    tasks: Task[];
    onTaskDeleted: () => void; // Callback para actualizar la lista después de eliminar
}

export function TaskList({ tasks, onTaskDeleted }: TaskListProps) {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const showEditModal = (task: Task) => {
        setEditingTask(task);
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditingTask(null);
        setIsEditModalVisible(false);
    };

    const handleDeleteTask = async (taskId: number) => {
        const response = await fetch(`/tasks/${taskId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            onTaskDeleted(); // Actualiza la lista de tareas en la interfaz
            message.success("¡Tarea eliminada!");
        } else {
            message.error("Hubo un error al eliminar la tarea.");
        }
    };

    const columns = [
        {
            title: "Fecha de Creación",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string | Date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Título de la Tarea",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            render: (status: number) => (
                <Tag color={status === 1 ? "green" : "red"}>{status}</Tag>
            ),
        },
        {
            title: "Prioridad",
            dataIndex: "priority",
            key: "priority",
            render: (priority: number) => (
                <Tag color={priority > 1 ? "volcano" : "geekblue"}>
                    {priority}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_: any, record: Task) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Seguro que quieres eliminar esta tarea?"
                        onConfirm={() => handleDeleteTask(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={tasks}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                className="w-full"
                scroll={{ x: true }}
            />

            <Modal
                title="Editar Tarea"
                open={isEditModalVisible}
                onCancel={closeEditModal}
                footer={null}
            >
                {editingTask && (
                    <TaskForm
                    task={{
                        ...editingTask,
                        description: editingTask.description, 
                    }}
                    onClose={closeEditModal}
                />
                )}
            </Modal>
        </>
    );
}
