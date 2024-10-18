// app/components/TaskForm.tsx
import { Form } from "@remix-run/react";
import { Input, Button, Space, Select } from "antd";
import React, { useState } from "react";

interface TaskFormProps {
    onClose: () => void;
    task?: {
        id: number;
        title: string;
        description: string | null;
        priority: number;
        status: number;
    };
}

export function TaskForm({ onClose, task }: TaskFormProps) {
    const isEditing = !!task;

    // Inicializamos el valor como número
    const [priority, setPriority] = useState<number>(task?.priority ? task.priority : 0);
    const [status, setStatus] = useState<number>(task?.status ? task.status : 0);

    // Nos aseguramos de convertir el valor a number al cambiar el Select
    const handlePriorityChange = (value: number) => {
        setPriority(Number(value));
    };
    const handleStatusChange = (value: number) => {
        setStatus(Number(value)); 
    };

    return (
        <Form
            method={isEditing ? "put" : "post"}
            action={isEditing ? `/tasks/${task?.id}` : "/tasks"}
            onSubmit={() => onClose()}
        >
            <Input
                placeholder="Título"
                name="title"
                defaultValue={task?.title}
                required
                className="mb-2"
            />
            <Input.TextArea
                placeholder="Descripción"
                name="description"
                defaultValue={task?.description || ""}
                rows={4}
                className="mb-2"
            />

            {/* Campo oculto para enviar el valor del Select */}
            <input type="hidden" name="priority" value={priority} />

            <Select
                defaultValue={priority}
                style={{ width: 120 }}
                onChange={handlePriorityChange}
            >
                <Select.Option value={0}>Baja</Select.Option>
                <Select.Option value={1}>Media</Select.Option>
                <Select.Option value={2}>Alta</Select.Option>
            </Select>
            <input type="hidden" name="status" value={status} />
            {isEditing && (
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={handleStatusChange}
                >
                    <Select.Option value={0}>Nuevo</Select.Option>
                    <Select.Option value={1}>En progreso</Select.Option>
                    <Select.Option value={2}>Cerrado</Select.Option>
                </Select>)}

            <Space>
                <Button type="primary" htmlType="submit">
                    {isEditing ? "Guardar Cambios" : "Crear Tarea"}
                </Button>
                {isEditing && (
                    <Button
                        danger
                        type="primary"
                        onClick={() => onClose()}
                    >
                        Cancelar
                    </Button>
                )}
            </Space>
        </Form>
    );
}
