import React from "react";
import { Mail, User, MapPin, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";

interface PersonalFormData {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  ninNumber: string;
  address: string;
  password: string;
}

interface PersonalFormFieldsProps {
  formData: PersonalFormData;
  showPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTogglePassword: () => void;
}

const PersonalFormFields: React.FC<PersonalFormFieldsProps> = ({
  formData,
  showPassword,
  onInputChange,
  onTogglePassword,
}) => {
  return (
    <>
      <div className="register-form-row">
        <div className="register-form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="First Name"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="register-form-row">
        <div className="register-form-group">
          <label htmlFor="gender">Gender</label>
          <div className="register-select-wrapper">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={onInputChange}
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <ChevronDown className="register-select-icon" size={20} />
          </div>
        </div>
        <div className="register-form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="email">Email</label>
        <div className="register-input-wrapper">
          <Mail className="register-input-icon" size={20} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Email"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="ninNumber">NIN Number</label>
        <div className="register-input-wrapper">
          <User className="register-input-icon" size={20} />
          <input
            type="text"
            id="ninNumber"
            name="ninNumber"
            value={formData.ninNumber}
            onChange={onInputChange}
            placeholder="NIN Number"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="address">Address</label>
        <div className="register-input-wrapper">
          <MapPin className="register-input-icon" size={20} />
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Address"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="password">Password</label>
        <div className="register-input-wrapper">
          <Lock className="register-input-icon" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Password"
          />
          <button
            type="button"
            className="register-password-toggle"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="register-input-icon" size={20} />
            ) : (
              <Eye className="register-input-icon" size={20} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PersonalFormFields;

