import http.server, socketserver 
import os

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
    """Return the requested file if it exists otherwise return index.html"""
    if os.access('.' + os.sep + self.path, os.R_OK):
      http.server.SimpleHTTPRequestHandler.do_GET(self);
    else:
      self.send_response(200)
      self.send_header('Content-Type', 'text/html')
      self.end_headers()
      self.wfile.write(bytes(open('index.html').read(),"utf-8"))

httpd = socketserver.TCPServer(('', PORT), MyHandler)
httpd.serve_forever()
