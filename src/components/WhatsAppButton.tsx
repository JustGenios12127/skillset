const WHATSAPP_NUMBER = "77071234567"; // ← замени на реальный номер
const WHATSAPP_MESSAGE = "Здравствуйте! Хочу получить консультацию.";

const WhatsAppButton = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl"
    >
      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 32 32"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
      >
        <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.478.651 4.845 1.889 6.916L2 30l7.307-1.858A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.454a11.39 11.39 0 0 1-5.808-1.591l-.416-.247-4.334 1.102 1.136-4.207-.271-.432a11.39 11.39 0 0 1-1.763-6.076c0-6.285 5.115-11.4 11.456-11.4 6.286 0 11.4 5.115 11.4 11.4 0 6.286-5.114 11.451-11.4 11.451zm6.27-8.552c-.344-.172-2.035-1.004-2.35-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.401.258-.745.086-.344-.172-1.452-.535-2.765-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.021-.53.15-.702.154-.154.344-.4.516-.6.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.602-.086-.172-.776-1.87-1.063-2.562-.28-.673-.563-.582-.776-.593l-.66-.011c-.23 0-.602.086-.917.43-.315.344-1.205 1.177-1.205 2.87s1.233 3.33 1.405 3.56c.172.23 2.427 3.704 5.88 5.193.822.355 1.464.567 1.964.726.825.263 1.576.226 2.17.137.662-.099 2.035-.832 2.322-1.635.287-.803.287-1.491.2-1.635-.086-.143-.315-.23-.659-.401z" />
      </svg>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
    </a>
  );
};

export default WhatsAppButton;
