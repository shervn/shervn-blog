FROM python:3.7

RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/
RUN pip install -r requirements.txt

COPY . /backend/
