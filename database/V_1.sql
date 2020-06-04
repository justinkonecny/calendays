create table if not exists user
(
    id            int auto_increment,
    firebase_uuid varchar(31) not null,
    first_name    varchar(31) not null,
    last_name     varchar(31) not null,
    email         varchar(63) not null,
    created_at    datetime    not null default CURRENT_TIMESTAMP,
    updated_at    datetime    not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    constraint user_pk
        primary key (id)
);

create unique index user_firebase_uuid_uindex
    on user (firebase_uuid);

create table if not exists network
(
    id         int auto_increment,
    name       varchar(31) not null,
    user_id    int         null,
    created_at datetime    not null default CURRENT_TIMESTAMP,
    updated_at datetime    not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    constraint network_pk
        primary key (id),
    constraint owner_fk
        foreign key (user_id) references user (id)
            on delete cascade
);

create table if not exists event
(
    id         int auto_increment,
    start_date datetime     not null,
    end_date   datetime     not null,
    location   varchar(63)  null,
    message    varchar(255) null,
    network_id int          not null,
    name       varchar(63)  not null,
    created_at datetime     not null default CURRENT_TIMESTAMP,
    updated_at datetime     not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    constraint event_pk
        primary key (id),
    constraint network_fk
        foreign key (network_id) references network (id)
);

create table if not exists network_user
(
    id         int auto_increment,
    user_id    int        not null,
    network_id int        not null,
    color_hex  varchar(7) null,
    constraint network_user_pk
        primary key (id),
    constraint network_user_network_id_fk
        foreign key (network_id) references network (id)
            on delete cascade,
    constraint network_user_user_id_fk
        foreign key (user_id) references user (id)
            on delete cascade
);

alter table user
	add username varchar(31) not null;
