export default function ApplicationLogo(props) {
    return (
        <img
            src="/images/Indonesia_Power_Logo.jpg/" // Adjust the path to your logo
            alt="PLN Logo"
            {...props}
            className={`h-16 w-auto object-contain transition-all duration-300 ${props.className || ''}`}
        />
    );
}