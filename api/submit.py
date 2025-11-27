from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # The correct answer for the "Electronics" revenue challenge
            CORRECT_ANSWER = 495759
            
            # Extract answer from payload (handle string or int)
            user_answer = data.get('answer')
            try:
                user_answer = int(float(user_answer))
            except (ValueError, TypeError):
                pass

            if user_answer == CORRECT_ANSWER:
                response_data = {
                    "correct": True,
                    "message": "Congratulations! That is the correct revenue.",
                    "next_url": "https://test2-iota-brown.vercel.app/", # Example next level
                    "flag": "CTF{y0u_s0lv3d_tH3_r3v3nu3_ch4ll3ng3}"
                }
                status = 200
            else:
                response_data = {
                    "correct": False,
                    "message": f"Incorrect answer. Expected {CORRECT_ANSWER}, but got {user_answer}.",
                    "hint": "Make sure you are filtering for 'Electronics' and calculating price * stock."
                }
                status = 400 # Or 200 with correct=False, depending on how you want to test

            self.send_response(status)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # CORS for testing
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
