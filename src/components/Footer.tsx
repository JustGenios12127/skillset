import { Link } from "react-router-dom";


const Footer = () => (
  <footer className="py-8 px-4 bg-foreground">
    <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-background/60">
        © {new Date().getFullYear()} Скилс Сет. Все права защищены.
      </p>
      <p className="text-sm text-background/60">
        <Link to="/login">ТОО «Скилс Сет»</Link>
      </p>
    </div>
  </footer>
);

export default Footer;
