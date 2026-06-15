import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      validate: {
        validator: function(v) {
          return !v || /^\S+@\S+\.\S+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s-()]+$/.test(v);
        },
        message: 'Invalid phone format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // По умолчанию не возвращается при запросах
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'candidate'],
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Дополнительные поля для HR
    company: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    // Дополнительные поля для Candidate
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology',
    }],
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profession',
    },
    experience: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Валидация: должен быть либо email, либо phone
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone must be provided');
    this.invalidate('phone', 'Either email or phone must be provided');
  }
  next();
});

// Индексы для быстрого поиска
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Метод для получения идентификатора (email или phone)
userSchema.methods.getIdentifier = function() {
  return this.email || this.phone;
};

export const User = mongoose.model('User', userSchema);

