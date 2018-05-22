
CREATE USER 'ppmc2'@'%' IDENTIFIED BY 'fine4now';
GRANT ALL PRIVILEGES ON *.* TO 'ppmc2'@'%' IDENTIFIED BY "fine4now";

# Create database ppmc with utf8;
CREATE DATABASE ppmc2
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

# Use db
use ppmc2;

create table employee (
    employeeId int not null auto_increment primary key,
    employeeName varchar(50) not null, 
    employeeAfiliation varchar(20),
    employeeRfc varchar(20),
    employeeCurp varchar(20),
    employeeLc varchar(20),
    employeeStatus enum("TRUE", "FALSE") not null default "TRUE"
);

create view vemployee as select * from employee;

create table role (
    roleId int not null auto_increment primary key,
    roleName varchar(50) not null, 
    rolePercentage float not null,
    roleStatus enum("TRUE", "FALSE") not null default "TRUE"
);

create view vrole as select * from role;

create table crew (
    crewId int not null auto_increment primary key,
    crewEmployeeId int not null,
    crewRoleId int not null,
    foreign key(crewEmployeeId) references employee(employeeId),
    foreign key(crewRoleId) references role(roleId)
);

create view vcrew as select * from crew;

create table ship (
    shipId int not null auto_increment primary key,
    shipName varchar(20) not null,
    shipAnoConstruccion varchar(50),
    shipEslora float,
    shipManga float,
    shipPuntal float,
    shipTonBrutas float,
    shipTonNetas float,
    shipCapAcarreo float,
    shipCapBodega float,
    shipSisConservacion varchar(50),
    shipCalado float,
    shipMotorSerie varchar(50),
    shipMotorModelo varchar(50),
    shipMotorMarca varchar(50),
    shipMotorPotencia varchar(50),
    shipPesqueraRnp varchar(50),
    shipRnp varchar(50),
    shipMatricula varchar(50),
    shipPermisoCamaron varchar(50),
    shipPermisoCamaronExpedicion date,
    shipPermisoCamaronVencimiento date,
    shipPermisoEscama varchar(50),
    shipPermisoEscamaExpedicion date,
    shipPermisoEscamaVencimiento date,
    shipStatus enum("TRUE", "FALSE") not null default "TRUE"
);

create view vship as select * from ship;

create table trip (
    tripId int not null auto_increment primary key,
    tripShipId int not null,
    tripCrewId int not null,
    tripDate date not null,
    tripStatus enum("TRUE", "FALSE") not null default "TRUE",
    foreign key(tripShipId) references ship(shipId)
);

create view vtrip as select * from trip;

create table inventory (
    inventoryId int not null auto_increment primary key, 
    inventoryTripId int not null,
    inventoryDate datetime default current_timestamp,
    inventoryReportId varchar(10),
    inventoryReportDate date,
    inventoryPlant varchar(50),
    inventorySupplier varchar(100),
    inventoryPlace varchar(50),
    inventoryLot varchar(50),
    inventoryPackageType enum("MARQUETA", "BOLSA") not null default "MARQUETA",
    inventoryPackageUnit enum("5LBS", "2KGS", "4LBS") not null default "5LBS",
    inventoryStatus enum("TRUE", "FALSE") not null default "TRUE",
    foreign key(inventoryTripId) references trip(tripId)
);

create view vinventory as select * from inventory;

create table specie (
    specieId int not null auto_increment primary key,
    specieDesc varchar(50) not null,
    specieType varchar(20) not null,
    specieStatus enum("TRUE", "FALSE") not null default "TRUE"
);

create view vspecie as select * from specie;

create table inventoryDetail (
    inventoryDetailId int not null auto_increment primary key,
    inventoryDetailInventoryId int not null,
    inventoryDetailSpecieIdId int not null,
    inventoryDetailAmount float not null,
    inventoryDetailAmountLeft float not null,
    inventoryStatus enum("TRUE", "FALSE") not null default "TRUE",
    foreign key(inventoryDetailInventoryId) references inventory(inventoryId),
    foreign key(inventoryDetailSpecieIdId) references specie(specieId)
);

create view vinventoryDetail as select * from inventoryDetail;

create table client (
    clientId int not null auto_increment primary key,
    clientName varchar(100) not null,
    clientStatus enum("TRUE", "FALSE") not null default "TRUE"
);

create view vclient as select * from client;

create table price (
    priceId int not null auto_increment primary key,
    priceSpecieId int not null,
    pricePrice float not null,
    priceDate date not null,
    priceStatus enum("TRUE", "FALSE") not null default "TRUE",
    priceClientId int not null,
    foreign key(priceSpecieId) references specie(specieId),
    foreign key(priceClientId) references client(clientId)
);

create view vprice as select * from price;

create table sale (
    saleId int not null auto_increment primary key,
    saleInventoryDetailId int not null,
    saleClientId int not null,
    saleAmount int not null,
    salePrice float not null,
    saleDate datetime not null default current_timestamp,
    saleStatus enum("TRUE", "FALSE") not null default "TRUE",
    foreign key(saleInventoryDetailId) references inventoryDetail(inventoryDetailId),
    foreign key(saleClientId) references client(clientId)
);

create view vsale as select * from sale;

create table returns (
    returnsId int not null auto_increment primary key,
    returnsSaleId int not null,
    returnsAmount float not null,
    returnsDate datetime not null default current_timestamp,
    returnsComment varchar(200),
    returnsStatus enum("TRUE", "FALSE") not null default "TRUE",
    foreign key(returnsSaleId) references sale(saleId)
);

create view vreturns as select * from returns;
