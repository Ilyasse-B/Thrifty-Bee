FROM ubuntu:22.04

WORKDIR /ThriftyBee

COPY ./ ./

RUN apt update -y
RUN apt upgrade -y
RUN apt install curl -y
RUN apt install nodejs -y
RUN apt install npm -y
RUN npm install


RUN apt install python3 -y
RUN apt install python3-venv -y
RUN apt install python3-pip -y
# RUN apt install postgresql postgresql-contrib -y
# It asks for a timezone in the terminal, but i cant provide an input

RUN pip install SQLAlchemy
RUN pip install Flask


CMD ["npm", "start"]