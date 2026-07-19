export default function HelperText({ message }) {
  return message ? <small className="helper-text">{message}</small> : null;
}