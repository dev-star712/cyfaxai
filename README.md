# Front end for Cyfax

## Requirements
1. Install requirements:

```
$ sudo apt-get install nodejs npm curl nginx certbot python3-certbot-nginx
$ sudo npm install pm2 -g
```

2. Setup firewall

```
$ sudo ufw allow 'OpenSSH'
$ sudo ufw allow 'Nginx HTTPS'
$ sudo ufw enable
```

3. Init npm by the following commands:

```
$ npm i
$ npm i sharp
```

4. Setup letsencrypt with certbot

First, you will need to point your domain to your server's IP with DNS Record (with A record, ...)

Next, edit the `/etc/nginx/sites-available/default` file:

```
server {
  # ...

  server_name <your domain> <your domain with "www">;

  # ...
}
```

Then, restart nginx by the following command: 

```
sudo nginx -t # check syntax errors
sudo systemctl restart nginx
```

Next, get letsencrypt cert:

```
sudo certbot --nginx -d <your domain> -d <your domain with "www">
```

5. Setup Reverse proxy

Edit the `/etc/nginx/sites-available/default` file again:

```
...

server {
    ...

    server_name <your domain> <your domain with "www">;

    ...

    location / {
        # Reverse proxy for Next server
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # we need to remove this 404 handling
        # because of Next's error handling and _next folder
        # try_files $uri $uri/ =404;
    }

    location /api {
        # Reverse proxy for Django server
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /user {
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
}

...
```

6. Restart Nginx again

```
sudo nginx -t # check syntax errors
sudo systemctl restart nginx
```

7. Run website

```
pm2 start npm --name "cyfax-frontend" -- start
```
