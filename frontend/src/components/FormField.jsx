const FormField = ({ label, name, error, children, hint }) => (
    <div className="form-field">
        <label htmlFor={name}>{label}</label>
        {children}
        {hint && !error && <span className="field-hint">{hint}</span>}
        {error && <span className="field-error">{error}</span>}
    </div>
);

export default FormField;
