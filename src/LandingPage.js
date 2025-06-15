import React, { useState } from 'react';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <header className="bg-primary text-white text-center py-4">
        <h1>Nama Website Kamu</h1>
      </header>

      <main className="container text-center my-5">
        <h2 className="mb-3">Selamat Datang di Website Kami</h2>
        <p className="mb-4 fs-5">
          Kami menyediakan layanan terbaik untuk membantu kebutuhan Anda dengan cepat dan mudah.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={openModal}
        >
          Pelajari Lebih Lanjut
        </button>
      </main>

      <footer className="bg-dark text-white text-center py-3">
        &copy; 2025 Nama Website Kamu. All rights reserved.
      </footer>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}
          tabIndex="-1"
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // supaya klik di dalam modal tidak menutup
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Informasi Tambahan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Tutup"
                ></button>
              </div>
              <div className="modal-body">
                Terima kasih telah mengunjungi website kami! Kami siap membantu Anda
                kapan saja.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingPage;
