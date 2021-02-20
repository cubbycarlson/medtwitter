--PART 1 (TABLES)

CREATE TABLE "public"."users" (
    "id" serial,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "email" text NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("username"),
    UNIQUE ("password"),
    UNIQUE ("email")
);

CREATE TABLE "public"."topics" (
    "id" serial,
    "topic" text,
    PRIMARY KEY ("id"),
    UNIQUE ("topic")
);

CREATE TABLE "public"."journals" (
    "id" serial,
    "journal_name" text,
    "topic" int,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."journal_pseudonyms" (
    "id" serial,
    "journal" int,
    "pseudonym" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."journal_years" (
    "id" serial,
    "journal" int,
    "year" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."articles" (
    "id" serial,
    "journal" text,
    "year" text,
    "title" text,
    "google_id" text,
    "google_link" text,
    "google_citation_count" text,
    "google_author" text,
    "doi" text,
    "elsevier_author" text,
    "publication_name" text,
    "elsevier_cover_date" text,
    "elsevier_cover_display_date" text,
    "elsevier_citation_count" text,
    "twitter_count" text,
    "altmetric_id" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."altmetric_authors" (
    "id" serial,
    "article" int,
    "author" text,
    "author_order" int,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."article_statuses" (
    "id" serial,
    "article" int,
    "status" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."statuses" (
    "id" serial,
    "time_collected" text,
    "statuses" text,
    "created_at" text,
    "twitter_id" text,
    "text" text,
    "statuses_user" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."statuses_users" (
    "id" serial,
    "twitter_id" text,
    "name" text,
    "screen_name" text,
    PRIMARY KEY ("id")
);

--PART 2 (PREFILLED DATA)

INSERT INTO users (username, password, email) VALUES ('cubby', '$2b$12$.ruahIyDSeTgIDIF0alEDuKRf0Kp5pUxix9PFjawKFKqsMyj4L8/G', 'cubbycarlson@gmail.com');
INSERT INTO "public"."topics"("topic") VALUES('emergency medicine') RETURNING "id", "topic";
INSERT INTO "public"."topics"("topic") VALUES('radiology') RETURNING "id", "topic";