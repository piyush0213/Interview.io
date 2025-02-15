const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dzow5xpbx/image/upload/v1729150366/blank_avatar_vywi2w.png",
    },
    role: {
        type: String,
        enum: ["candidate", "interviewer"],
        default: "candidate",
    },
    interviewsAttended: {
        type: Number,
        default: 0,
    },
    interviewsConducted: {
        type: Number,
        default: 0,
    },
    quizTaken: {
        type: Number,
        default: 0,
    },
    resume: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', function(next) {
    if (this.role === 'interviewer') {
        if (!this.interviewsConducted) {
            this.interviewsConducted = 0;
        }
        this.interviewsAttended = undefined;
        this.mockTestsTaken = undefined;
    } else if (this.role === 'candidate') {
        if (!this.interviewsAttended) {
            this.interviewsAttended = 0;
        }
        this.interviewsConducted = undefined;
    }
    next();
});

// export const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);