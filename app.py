from flask import Flask, render_template, request, redirect, url_for
import os
from moviepy.editor import VideoFileClip

app = Flask(__name__)

VIDEO_FOLDER = 'static/videos'
THUMBNAIL_FOLDER = 'static/thumbnails'

os.makedirs(VIDEO_FOLDER, exist_ok=True)
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

def generate_thumbnail(video_path):
    thumbnail_filename = os.path.basename(video_path).replace('.mp4', '.jpg')
    thumbnail_path = os.path.join(THUMBNAIL_FOLDER, thumbnail_filename)
    
    if not os.path.exists(thumbnail_path):
        clip = VideoFileClip(video_path)
        clip.save_frame(thumbnail_path, t=clip.duration / 2)
    return url_for('static', filename='thumbnails/' + thumbnail_filename)

@app.route('/')
def index():
    search_query = request.args.get('search')
    videos = os.listdir(VIDEO_FOLDER)
    video_thumbnail_pairs = []

    for video in videos:
        if video.endswith('.mp4'):
            thumbnail_path = generate_thumbnail(os.path.join(VIDEO_FOLDER, video))
            video_thumbnail_pairs.append((video, thumbnail_path))

    if search_query:
        video_thumbnail_pairs = [
            (video, thumbnail) for video, thumbnail in video_thumbnail_pairs
            if search_query.lower() in video.lower()
        ]

    return render_template('index.html', video_thumbnail_pairs=video_thumbnail_pairs)

@app.route('/upload')
def upload_page():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'video_file' not in request.files:
        return "No file part", 400
    video_file = request.files['video_file']
    
    if video_file.filename == '':
        return "No selected file", 400
    
    if video_file and video_file.filename.endswith('.mp4'):
        video_filename = os.path.join(VIDEO_FOLDER, video_file.filename)
        video_file.save(video_filename)
        
        generate_thumbnail(video_filename)
        
        return redirect(url_for('index'))  # Redirect to the main page (gallery)

@app.route('/video/<video_name>')
def video(video_name):
    video_path = os.path.join(VIDEO_FOLDER, video_name)
    if not os.path.isfile(video_path):
        return "Video not found", 404
    return render_template('video.html', video_name=video_name)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
