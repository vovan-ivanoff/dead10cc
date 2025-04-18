# Use the official Python image from the Docker Hub
FROM python:3.12

# Set the working directory in the container
WORKDIR /src

# Copy the current directory contents into the container at /app
COPY ./requirements.txt .
#install torch. Fuck it
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu
# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt
# Make port 80 available to the world outside this container
COPY . /src
EXPOSE 5100

# Run app.py when the container launches
CMD ["python", "main.py"]