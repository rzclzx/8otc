FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY assets /58otc/assets/
COPY components /58otc/components/
COPY layouts /58otc/layouts/
COPY static /58otc/static/
COPY server /58otc/server/
COPY config /58otc/config/
COPY middleware /58otc/middleware/
COPY store /58otc/store/
COPY locales /58otc/locales/
COPY build /58otc/build/
COPY plugins /58otc/plugins/
COPY pages /58otc/pages/
COPY .babelrc /58otc
COPY .editorconfig /58otc
COPY .eslintrc.js /58otc
COPY package.json /58otc
COPY pm2.json /58otc
COPY nuxt.config.js /58otc
COPY backpack.config.js /58otc
WORKDIR /58otc
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install
#RUN npm install eslint-loader
RUN npm run build
# Show current folder structure in logs
#RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]
