FROM ubuntu:22.04

RUN apt update -y
RUN apt upgrade -y

RUN apt install nodejs -y
RUN apt install npm -y



RUN apt install python3 -y
RUN apt install python3-venv -y
RUN apt install python3-pip -y
# RUN apt install postgresql postgresql-contrib -y
# It asks for a timezone in the terminal, but i cant provide an input

RUN pip install SQLAlchemy
RUN pip install Flask
RUN pip install Flask_cors
RUN pip install flask_migrate

# RUN flask db init
# RUN flask db migrate
# RUN flask db upgrade
EXPOSE 5000
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# RUN npm install
EXPOSE 3000

# RUN npm start
# RUN flask run