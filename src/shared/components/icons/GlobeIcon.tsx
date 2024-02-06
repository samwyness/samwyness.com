import { SVGProps } from 'react';

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 42.9999C21.3948 42.9999 18.9365 42.5005 16.625 41.5018C14.3135 40.5031 12.2974 39.1435 10.5769 37.423C8.8564 35.7025 7.4968 33.6864 6.4981 31.3749C5.49937 29.0634 5 26.6051 5 24C5 21.3743 5.49937 18.9109 6.4981 16.6096C7.4968 14.3083 8.8564 12.2974 10.5769 10.5769C12.2974 8.8564 14.3135 7.4968 16.625 6.4981C18.9365 5.49937 21.3948 5 24 5C26.6256 5 29.089 5.49937 31.3903 6.4981C33.6916 7.4968 35.7025 8.8564 37.423 10.5769C39.1435 12.2974 40.5031 14.3083 41.5018 16.6096C42.5005 18.9109 42.9999 21.3743 42.9999 24C42.9999 26.6051 42.5005 29.0634 41.5018 31.3749C40.5031 33.6864 39.1435 35.7025 37.423 37.423C35.7025 39.1435 33.6916 40.5031 31.3903 41.5018C29.089 42.5005 26.6256 42.9999 24 42.9999ZM24 39.9577C25.0205 38.6038 25.8795 37.2384 26.5769 35.8615C27.2743 34.4845 27.8423 32.9794 28.2808 31.3461H19.7192C20.1833 33.0307 20.7576 34.5615 21.4423 35.9384C22.1269 37.3153 22.9794 38.6551 24 39.9577ZM20.127 39.4077C19.3603 38.3077 18.6718 37.057 18.0616 35.6557C17.4513 34.2544 16.9769 32.8179 16.6385 31.3461H9.85375C10.9102 33.423 12.3269 35.1679 14.1038 36.5808C15.8808 37.9936 17.8885 38.9359 20.127 39.4077ZM27.873 39.4077C30.1114 38.9359 32.1191 37.9936 33.8961 36.5808C35.673 35.1679 37.0897 33.423 38.1462 31.3461H31.3615C30.9589 32.8307 30.4525 34.2737 29.8422 35.675C29.2319 37.0763 28.5755 38.3205 27.873 39.4077ZM8.5961 28.3462H16.0308C15.9051 27.6026 15.8141 26.8737 15.7577 26.1596C15.7013 25.4455 15.6731 24.7256 15.6731 24C15.6731 23.2743 15.7013 22.5544 15.7577 21.8403C15.8141 21.1262 15.9051 20.3974 16.0308 19.6538H8.5961C8.4038 20.3333 8.25637 21.0397 8.1538 21.773C8.05123 22.5063 7.99995 23.2487 7.99995 24C7.99995 24.7513 8.05123 25.4936 8.1538 26.2269C8.25637 26.9602 8.4038 27.6667 8.5961 28.3462ZM19.0307 28.3462H28.9692C29.0948 27.6026 29.1859 26.8801 29.2423 26.1788C29.2987 25.4775 29.3269 24.7513 29.3269 24C29.3269 23.2487 29.2987 22.5224 29.2423 21.8211C29.1859 21.1198 29.0948 20.3974 28.9692 19.6538H19.0307C18.9051 20.3974 18.814 21.1198 18.7576 21.8211C18.7012 22.5224 18.673 23.2487 18.673 24C18.673 24.7513 18.7012 25.4775 18.7576 26.1788C18.814 26.8801 18.9051 27.6026 19.0307 28.3462ZM31.9692 28.3462H39.4038C39.5961 27.6667 39.7435 26.9602 39.8461 26.2269C39.9487 25.4936 40 24.7513 40 24C40 23.2487 39.9487 22.5063 39.8461 21.773C39.7435 21.0397 39.5961 20.3333 39.4038 19.6538H31.9692C32.0948 20.3974 32.1858 21.1262 32.2422 21.8403C32.2986 22.5544 32.3268 23.2743 32.3268 24C32.3268 24.7256 32.2986 25.4455 32.2422 26.1596C32.1858 26.8737 32.0948 27.6026 31.9692 28.3462ZM31.3615 16.6539H38.1462C37.0769 14.5513 35.6698 12.8064 33.925 11.4192C32.1801 10.032 30.1627 9.08327 27.873 8.573C28.6396 9.7371 29.3217 11.0102 29.9191 12.3923C30.5166 13.7743 30.9974 15.1949 31.3615 16.6539ZM19.7192 16.6539H28.2808C27.8167 14.9821 27.2327 13.4417 26.5288 12.0327C25.825 10.6237 24.982 9.29355 24 8.04225C23.0179 9.29355 22.1749 10.6237 21.4711 12.0327C20.7672 13.4417 20.1833 14.9821 19.7192 16.6539ZM9.85375 16.6539H16.6385C17.0026 15.1949 17.4833 13.7743 18.0808 12.3923C18.6782 11.0102 19.3603 9.7371 20.127 8.573C17.8244 9.08327 15.8039 10.0352 14.0654 11.4288C12.3269 12.8224 10.923 14.5641 9.85375 16.6539Z"
        fill="currentColor"
      />
    </svg>
  );
}