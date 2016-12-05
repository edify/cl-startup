FROM elasticsearch:2.4.2

COPY config /usr/share/elasticsearch/config
RUN plugin install royrusso/elasticsearch-HQ
RUN plugin install mapper-attachments
