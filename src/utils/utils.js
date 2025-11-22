import Swal from "sweetalert2";

export const ShowPopup = (title, text, icon) => {
  Swal.fire({
    title: `<span style="
      color: ${icon === 'success' ? '#00ff00' : icon === 'error' ? '#ff0000' : '#00ffff'};
      text-transform: uppercase;
      letter-spacing: 3px;
      text-shadow: 0 0 20px ${icon === 'success' ? '#00ff00' : icon === 'error' ? '#ff0000' : '#00ffff'};
      font-weight: bold;
    ">${title}</span>`,
    html: `<p style="color: #fff; font-size: 16px; line-height: 1.6;">${text}</p>`,
    icon: icon,
    showConfirmButton: false,
    timer: 2000,
    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(139, 92, 246, 0.1), rgba(255, 0, 255, 0.1))',
    backdrop: `
      rgba(0, 0, 0, 0.8)
      backdrop-filter: blur(5px)
    `,
    customClass: {
      popup: 'futuristic-popup',
      icon: 'futuristic-icon'
    },
    didOpen: () => {
      const style = document.createElement('style');
      style.textContent = `
        .futuristic-popup {
          border: 2px solid ${icon === 'success' ? 'rgba(0, 255, 0, 0.5)' : icon === 'error' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 255, 0.5)'} !important;
          border-radius: 24px !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 0 0 60px ${icon === 'success' ? 'rgba(0, 255, 0, 0.4)' : icon === 'error' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 255, 255, 0.4)'}, 
                      inset 0 0 60px rgba(0, 0, 0, 0.3) !important;
        }
        .futuristic-icon {
          border: 3px solid ${icon === 'success' ? '#00ff00' : icon === 'error' ? '#ff0000' : '#00ffff'} !important;
          box-shadow: 0 0 40px ${icon === 'success' ? '#00ff00' : icon === 'error' ? '#ff0000' : '#00ffff'} !important;
          animation: iconPulse 1.5s infinite !important;
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }
  });
};