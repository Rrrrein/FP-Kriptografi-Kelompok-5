from flask import Flask, request, jsonify
import RSA # Ini mengimpor file RSA.py Anda

# Inisialisasi aplikasi server
app = Flask(__name__)

# Saat server pertama kali jalan, cek apakah file kunci sudah ada.
# Jika belum, panggil fungsi generate_keys() dari RSA.py untuk membuatnya.
try:
    with open("private.pem", "r") as f:
        print("File kunci (private.pem) sudah ada.")
except FileNotFoundError:
    print("File kunci tidak ditemukan. Membuat file baru: private.pem dan public.pem...")
    # Sediakan dua angka prima p dan q
    p = 61
    q = 53
    # Panggil fungsi generate_key dengan menyertakan p dan q
    RSA.generate_key(p, q) 
    print("File kunci berhasil dibuat.")


# Ini adalah alamat/URL yang akan dipanggil oleh aplikasi web
@app.route("/sign", methods=["POST"])
def sign_handler():
    # Ambil data yang dikirim oleh aplikasi web
    json_data = request.get_json()
    if not json_data or 'data' not in json_data:
        return jsonify({"error": "Request harus berisi 'data'"}), 400

    data_to_sign = json_data['data']

    try:
        # Muat kunci privat dari file
        private_key = RSA.load_private_key("private.pem")
        
        # Buat tanda tangan digital menggunakan fungsi dari RSA.py
        signature = RSA.sign(private_key, data_to_sign)
        
        # Kirim kembali tanda tangan dalam format JSON
        return jsonify({"signature": signature})

    except Exception as e:
        # Jika terjadi error, kirim pesan error
        return jsonify({"error": str(e)}), 500

# Perintah untuk menjalankan server
if __name__ == "__main__":
    print("Menjalankan server Python di http://localhost:5000")
    app.run(port=5000)