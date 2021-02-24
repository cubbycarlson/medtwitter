SELECT statuses.statuses
FROM statuses
	JOIN article_statuses ON statuses.id = article_statuses.article
	JOIN articles ON article_statuses.article = articles.id
	JOIN journals ON articles.journal = journals.id
	JOIN topics on journals.topic = topics.id
WHERE topics.topic = 'radiology' AND articles.year = '2017'