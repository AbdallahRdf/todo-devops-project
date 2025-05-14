import { model, Types } from "mongoose";
import { Document, Schema, SchemaTypes } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    status: string;
    dueDate?: Date;
    priority: string;
    userId: Types.ObjectId | string
}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "cancelled"],
        default: "pending",
    },
    dueDate: {
        type: Date,
        required: false,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    }
}, 
{
    timestamps: true,
});

export const Task = model<ITask>("Task", taskSchema);