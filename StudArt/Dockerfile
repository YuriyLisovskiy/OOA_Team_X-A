# The official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.7-buster

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME

COPY ./requirements.txt ./
COPY ./requirements-prod.txt ./

# Install production dependencies.
RUN pip install --upgrade pip setuptools wheel \
 && pip install -r requirements.txt \
 && pip install -r requirements-prod.txt

# Copy local code to the container image.
COPY . ./

# Change client key permission.
#RUN chmod 0600 /app/cert/client-key.pem

# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
CMD exec gunicorn --bind :$PORT --workers=1 --threads=8 --timeout=300 StudArt.wsgi
