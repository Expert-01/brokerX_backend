--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: deposits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deposits (
    id integer NOT NULL,
    user_id integer,
    plan character varying(50) NOT NULL,
    method character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount numeric(12,2) NOT NULL
);


ALTER TABLE public.deposits OWNER TO postgres;

--
-- Name: deposits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deposits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deposits_id_seq OWNER TO postgres;

--
-- Name: deposits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deposits_id_seq OWNED BY public.deposits.id;


--
-- Name: investments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investments (
    id integer NOT NULL,
    user_id integer,
    plan character varying(20) NOT NULL,
    amount numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.investments OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.investments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.investments_id_seq OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.investments_id_seq OWNED BY public.investments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    balance numeric DEFAULT 0,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: deposits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposits ALTER COLUMN id SET DEFAULT nextval('public.deposits_id_seq'::regclass);


--
-- Name: investments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments ALTER COLUMN id SET DEFAULT nextval('public.investments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: deposits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deposits (id, user_id, plan, method, status, created_at, amount) FROM stdin;
1	6	starter	usdt	pending	2025-09-09 01:01:33.570241	100.00
2	6	Starter	USDT	pending	2025-09-09 01:12:54.805466	200.00
3	6	starter	usdt	pending	2025-09-09 01:27:42.092936	100.00
4	6	starter	usdt	pending	2025-09-09 01:28:18.332213	100.00
5	6	starter	usdt	pending	2025-09-09 01:28:46.890012	100.00
6	6	starter	usdt	pending	2025-09-09 01:30:01.656919	100.00
7	6	starter	usdt	pending	2025-09-09 01:31:28.48908	100.00
8	6	starter	usdt	pending	2025-09-09 01:32:08.094406	100.00
9	6	pro	usdt	pending	2025-09-09 01:53:45.39834	1000.00
10	6	pro	usdt	pending	2025-09-09 01:53:45.456912	1000.00
11	2	starter	usdt	pending	2025-09-09 02:41:35.054651	200.00
12	2	starter	usdt	pending	2025-09-09 02:41:35.078701	200.00
13	6	starter	usdt	pending	2025-09-09 10:18:07.47986	100.00
14	6	starter	usdt	pending	2025-09-09 10:18:07.525532	100.00
15	6	starter	usdt	pending	2025-09-09 10:25:10.966629	100.00
16	6	starter	usdt	pending	2025-09-09 10:25:10.976807	100.00
17	6	starter	usdt	pending	2025-09-09 10:43:30.936209	400.00
18	6	starter	usdt	pending	2025-09-09 10:43:30.971648	400.00
19	6	pro	usdt	pending	2025-09-09 10:58:30.156403	2000.00
20	6	pro	usdt	pending	2025-09-09 10:58:30.193444	2000.00
21	6	starter	usdt	pending	2025-09-09 14:37:52.44409	900.00
22	6	starter	usdt	pending	2025-09-09 14:37:52.472293	900.00
23	6	starter	usdt	pending	2025-09-09 14:39:03.559774	225.00
35	6	starter	usdt	approved	2025-09-09 21:28:22.931452	100.00
25	6	pro	usdt	pending	2025-09-09 15:08:48.681923	1000.00
39	6	starter	usdt	approved	2025-09-09 21:44:56.261899	107.00
36	6	starter	usdt	approved	2025-09-09 21:28:22.941428	100.00
37	6	starter	usdt	approved	2025-09-09 21:30:49.69739	115.00
59	7	starter	usdt	approved	2025-09-10 03:20:02.045844	20.00
58	7	starter	usdt	approved	2025-09-10 03:09:26.193353	100.00
57	7	starter	usdt	approved	2025-09-10 03:09:26.186205	100.00
56	7	starter	usdt	approved	2025-09-10 02:52:06.070695	10.00
55	7	starter	usdt	approved	2025-09-10 02:52:06.052199	10.00
54	7	starter	usdt	approved	2025-09-10 02:47:16.821451	50.00
53	7	starter	usdt	approved	2025-09-10 02:47:16.80137	50.00
24	6	starter	usdt	approved	2025-09-09 14:39:03.568423	225.00
38	6	starter	usdt	approved	2025-09-09 21:30:49.707231	115.00
40	6	starter	usdt	approved	2025-09-09 21:44:56.307271	107.00
41	6	starter	usdt	pending	2025-09-09 21:56:41.893149	109.00
42	6	starter	usdt	approved	2025-09-09 21:56:41.92613	109.00
43	6	starter	usdt	pending	2025-09-09 22:14:27.803625	118.00
44	6	starter	usdt	approved	2025-09-09 22:14:27.832827	118.00
45	6	starter	usdt	pending	2025-09-09 22:49:34.314943	245.00
46	6	starter	usdt	approved	2025-09-09 22:49:34.343847	245.00
48	6	starter	usdt	approved	2025-09-09 22:50:21.865031	103.00
28	6	starter	usdt	approved	2025-09-09 15:36:21.73174	235.00
27	6	starter	usdt	approved	2025-09-09 15:36:21.704198	235.00
30	6	starter	usdt	approved	2025-09-09 21:15:01.906271	100.00
29	6	starter	usdt	approved	2025-09-09 21:15:01.879988	100.00
26	6	pro	usdt	approved	2025-09-09 15:08:48.729011	1000.00
32	6	starter	usdt	approved	2025-09-09 21:19:11.645699	200.00
31	6	starter	usdt	approved	2025-09-09 21:19:11.630193	200.00
47	6	starter	usdt	approved	2025-09-09 22:50:21.850508	103.00
49	6	starter	usdt	pending	2025-09-09 22:53:35.038854	121.00
34	6	starter	usdt	approved	2025-09-09 21:26:01.754651	100.00
33	6	starter	usdt	approved	2025-09-09 21:26:01.73211	100.00
50	6	starter	usdt	approved	2025-09-09 22:53:35.048278	121.00
60	8	pro	usdt	approved	2025-09-13 04:51:08.495442	1.00
52	6	pro	usdt	approved	2025-09-09 22:54:16.135352	1233.00
51	6	pro	usdt	approved	2025-09-09 22:54:16.11585	1233.00
61	8	pro	usdt	approved	2025-09-13 04:52:43.927587	100000.00
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investments (id, user_id, plan, amount, created_at) FROM stdin;
1	7	starter	100.00	2025-09-10 03:09:04.538572
2	7	pro	1000.00	2025-09-10 08:39:40.354211
3	8	pro	1000.00	2025-09-13 04:54:13.261096
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, balance, is_admin) FROM stdin;
3	Daniel	dael@gmail.com	$2b$10$wDDw9OJzYOE9ZWapxXa/5Ot7Lzvr6DtOjJ2INBun3ymTGWwmFXJk2	2025-09-02 14:58:48.484642	0	f
4	Test	test@gmail.com	$2b$10$s/gmLPkNKqAaLyKcjv204uy4GfYitt5cbrvBB2O04coA54kbBIrFG	2025-09-02 15:11:42.055986	0	f
5	Test@	test2@gmail.com	$2b$10$3NoJINRRrYqf1766wWWAFOf61UxfqnG4DRi/v3RJv3Xei6QQPZcKu	2025-09-02 15:21:21.686345	0	f
1	Gideon	gidsoala@gmail.com	$2b$10$av80/NjXKb6HmvctmQHnRO/3oteb4IH1V7wWi1i71/42Lq2WcqLeK	2025-09-02 14:52:31.645451	0	t
2	Daniel	daniel@gmail.com	$2b$10$InlcPQvUmlLgYdQti/fsguBFaYZVGKTu0DpLJkSqh6Az1D61WLJne	2025-09-02 14:58:16.751853	200	f
7	Sasuke	sasuke@gmail.com	$2b$10$kWGxPwJ2QWXGgK/P9Tfk9ODvujB/6cUwjYPFSGLc0/yPCKPkycMUW	2025-09-10 02:46:25.813215	323.483333333333336654	f
8	Juraya	juraya@gmail.com	$2b$10$bKACLrYTQFqE5PyBanpl8.mPoN7Z/SKM91/V2qjkY7j9SI66jkNV.	2025-09-13 04:50:31.318578	199059.430555555555558496	f
9	Harry	harry@gmail.com	$2b$10$UaRW4Z/yTqyggP1fPpyAM.UXoR2N.wPJoOdxNxO3JvyTSOQvpVKMC	2025-09-16 09:54:48.082973	0	f
6	Emmanuel	emma@gmail.com	$2b$10$oEcoslarAAufwzzQ89MCeexsf6.zbWa4Ks8/NlN/3TNmH1hlyiZWy	2025-09-03 16:43:27.97019	6286.00	f
\.


--
-- Name: deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deposits_id_seq', 61, true);


--
-- Name: investments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investments_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: deposits deposits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_pkey PRIMARY KEY (id);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: deposits deposits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: investments investments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO brokeradmin;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO brokeradmin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: brokeradmin
--

ALTER DEFAULT PRIVILEGES FOR ROLE brokeradmin IN SCHEMA public GRANT ALL ON TABLES TO brokeradmin;


--
-- PostgreSQL database dump complete
--

