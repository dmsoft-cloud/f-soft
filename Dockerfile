# Usa un'immagine di base di Node.js per la fase di build
FROM node:18 as build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file del progetto
COPY package.json package-lock.json ./
RUN npm install --force

# Copia il resto dei file e compila Angular in modalità produzione
COPY . .
RUN npm run build -- --configuration=production

# Usa un'immagine leggera di Nginx per servire i file Angular
FROM nginx:1.23

# Copia i file buildati da Angular nella cartella di Nginx
COPY --from=build /app/dist/f-soft-app /usr/share/nginx/html

# Copia una configurazione personalizzata di Nginx per gestire il routing di Angular
# montato come volume in fase di run
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Espone la porta 80 per l'accesso HTTP
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
