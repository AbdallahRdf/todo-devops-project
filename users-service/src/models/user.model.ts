import { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    refreshTokens?: Types.Array<string>;
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
    refreshTokens: {
        type: [String],
        default: [],
    }
}, 
{
    timestamps: true,
});

export const User = model<IUser>("User", userSchema);
