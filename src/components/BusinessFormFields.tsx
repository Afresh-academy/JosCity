import React from "react";
import { Mail, MapPin, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";

interface BusinessFormData {
  businessName: string;
  businessType: string;
  businessEmail: string;
  cacNumber: string;
  businessPhone: string;
  businessAddress: string;
  businessPassword: string;
}

interface BusinessFormFieldsProps {
  formData: BusinessFormData;
  showPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTogglePassword: () => void;
}

const BusinessFormFields: React.FC<BusinessFormFieldsProps> = ({
  formData,
  showPassword,
  onInputChange,
  onTogglePassword,
}) => {
  return (
    <>
      <div className="register-form-row">
        <div className="register-form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={onInputChange}
            placeholder="Business Name"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="businessType">Business Type</label>
          <div className="register-select-wrapper">
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={onInputChange}
            >
              <option value="">Select Type</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="register-select-icon" size={20} />
          </div>
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="businessEmail">Business Email</label>
        <div className="register-input-wrapper">
          <Mail className="register-input-icon" size={20} />
          <input
            type="email"
            id="businessEmail"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={onInputChange}
            placeholder="Business Email"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="cacNumber">CAC Number</label>
        <input
          type="text"
          id="cacNumber"
          name="cacNumber"
          value={formData.cacNumber}
          onChange={onInputChange}
          placeholder="CAC Number"
        />
      </div>

      <div className="register-form-group">
        <label htmlFor="businessPhone">Business Phone</label>
        <input
          type="tel"
          id="businessPhone"
          name="businessPhone"
          value={formData.businessPhone}
          onChange={onInputChange}
          placeholder="Business Phone"
        />
      </div>

      <div className="register-form-group">
        <label htmlFor="businessAddress">Business Address</label>
        <div className="register-input-wrapper">
          <MapPin className="register-input-icon" size={20} />
          <input
            type="text"
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={onInputChange}
            placeholder="Business Address"
          />
        </div>
      </div>

      <div className="register-form-group">
        <label htmlFor="businessPassword">Password</label>
        <div className="register-input-wrapper">
          <Lock className="register-input-icon" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            id="businessPassword"
            name="businessPassword"
            value={formData.businessPassword}
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

export default BusinessFormFields;

