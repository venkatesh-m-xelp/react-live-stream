## Live Demo

* https://react-live-stream.herokuapp.com/

## Installation Process

```sh
# clone the project
git clone https://github.com/venkatesh-m-xelp/react-live-stream.git

# install from NPM (For Windows)
npm install -g rtcmulticonnection

# install from NPM (For Linux)
sudo npm install -g rtcmulticonnection

# install all required packages
# you can optionally include --save-dev
npm install

node server --port=9001
```
Now open http://localhost:9001/.

## Heroku Configuration

If you are installing on heroku, please make sure to enable following config variables:

1. `NODE_MODULES_CACHE:false`
2. `NPM_CONFIG_PRODUCTION:false`
3. `YARN_PRODUCTION:false`

You can set above variables through heroku CLI as well:

```sh
heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false NODE_MODULES_CACHE=false
```

# Modify config.json

```json
{
  "socketURL": "/",
  "socketMessageEvent": "abcdef",
  "socketCustomEvent": "ghijkl",
  "port": "443",
  "enableLogs": "false",
  "autoRebootServerOnFailure": "false",
  "isUseHTTPs": "true",
  "ssl_key": "/ssl/certificate.key",
  "ssl_cert": "/ssl/certificate.crt",
  "ssl_cabundle": "/ssl/certificate.cabundle"
}
```

## License

[ReactLiveStream](https://github.com/venkatesh-m-xelp/react-live-stream) is released under [MIT licence](https://github.com/venkatesh-m-xelp/react-live-stream/blob/master/LICENSE.md) . Copyright (c) [Muaz Khan](https://MuazKhan.com/).
