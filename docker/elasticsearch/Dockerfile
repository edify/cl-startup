FROM elasticsearch:2.4.2

COPY config /usr/share/elasticsearch/config
RUN plugin install royrusso/elasticsearch-hq/v2.0.3
RUN plugin install mapper-attachments
