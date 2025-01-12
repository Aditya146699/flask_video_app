FROM python:alpine3.7 
COPY . /app
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt 
EXPOSE 8000 
ENTRYPOINT [ "python" ] 
CMD [ "app.py" ] 