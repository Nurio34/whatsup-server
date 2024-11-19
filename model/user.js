const mongoose = require("mongoose");
const validator = require("validator");
const bcrytp = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username !"],
            trim: true,
            minlength: [3, "Username can not be less than 3 characters !"],
            maxlength: [21, "Username can not be greater than 21 characters !"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email !"],
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: "Invalid email format !",
            },
        },
        password: {
            type: String,
            required: [true, "Please provide a password !"],
            minlength: [8, "Password must be at least 8 characters long."],
            validate: [
                {
                    validator: function (value) {
                        return /[A-Z]/.test(value);
                    },
                    message:
                        "Password must contain at least one uppercase letter.",
                },
                {
                    validator: function (value) {
                        return /\d/.test(value);
                    },
                    message: "Password must contain at least one number.",
                },
                {
                    validator: function (value) {
                        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(
                            value,
                        );
                    },
                    message:
                        "Password must contain at least one special character.",
                },
            ],
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm the password !"],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords don't match !",
            },
        },
        newUser: {
            type: Boolean,
            default: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        about: {
            type: String,
            default: "",
        },
        otp: {
            type: String,
            default: "",
        },
        otpExpires: {
            type: Date,
            default: Date.now(),
        },
        resetPasswordOtp: {
            type: String,
            default: "",
        },
        resetPasswordOtpExpires: {
            type: Date,
            default: Date.now(),
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true, collection: "User" },
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrytp.hash(this.password, 12);
    this.passwordConfirm = "";
});

UserSchema.methods.checkPassword = async function (password) {
    return await bcrytp.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
