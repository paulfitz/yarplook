yarplook
========

A json-based view of a YARP network.  To use it, start the YARP name
server as follows:

    yarpserver --web /path/to/web/directory/from/this/repository/web

As it starts up, it will tell you something like:

    Name server can be browsed at http://ip.ad.dr.ess:10000/

Visiting this address will show YARP's classic web interface,
served with the css in web/main.css.  To see the json-based view,
visit instead:

    http://ip.ad.dr.ess:10000/web/

