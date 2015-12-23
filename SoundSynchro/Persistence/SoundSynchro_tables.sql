/* CodeFluent Generated Tuesday, 22 December 2015 14:46. TargetVersion:Sql2008, Sql2012, Sql2014, SqlAzure. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
DROP TABLE [dbo].[Music]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
DROP TABLE [dbo].[Playlist]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_musics_Music]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
DROP TABLE [dbo].[Playlist_musics_Music]
GO

/* no fk for 'PK_Mus_Mus_Mus', tableName='Music' table='Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [PK_Mus_Mus_Mus]
GO
/* no fk for 'DF_Mus__tc', tableName='Music' table='Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Mus__tc]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [DF_Mus__tc]
GO
/* no fk for 'DF_Mus__tk', tableName='Music' table='Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Mus__tk]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [DF_Mus__tk]
GO
CREATE TABLE [dbo].[Music] (
 [Music_id] [uniqueidentifier] NOT NULL,
 [Music_title] [nvarchar] (256) NULL,
 [Music_file] [nvarchar] (256) NULL,
 [Music_thumbnail] [nvarchar] (256) NULL,
 [Music_date] [datetime] NULL,
 [_trackLastWriteTime] [datetime] NOT NULL CONSTRAINT [DF_Mus__tc] DEFAULT (GETDATE()),
 [_trackCreationTime] [datetime] NOT NULL CONSTRAINT [DF_Mus__tk] DEFAULT (GETDATE()),
 [_trackLastWriteUser] [nvarchar] (64) NOT NULL,
 [_trackCreationUser] [nvarchar] (64) NOT NULL,
 [_rowVersion] [rowversion] NOT NULL,
 CONSTRAINT [PK_Mus_Mus_Mus] PRIMARY KEY CLUSTERED
 (

  [Music_id]
 )
)
GO

/* no fk for 'PK_Pla_Pla_Pla', tableName='Playlist' table='null' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [PK_Pla_Pla_Pla]
GO
CREATE TABLE [dbo].[Playlist] (
 [Playlist_id] [uniqueidentifier] NOT NULL,
 [Playlist_date] [datetime] NULL,
 [Playlist_title] [nvarchar] (256) NULL,
 [_trackLastWriteTime] [datetime] NOT NULL CONSTRAINT [DF_Pla__tc] DEFAULT (GETDATE()),
 [_trackCreationTime] [datetime] NOT NULL CONSTRAINT [DF_Pla__tk] DEFAULT (GETDATE()),
 [_trackLastWriteUser] [nvarchar] (64) NOT NULL,
 [_trackCreationUser] [nvarchar] (64) NOT NULL,
 [_rowVersion] [rowversion] NOT NULL,
 CONSTRAINT [PK_Pla_Pla_Pla] PRIMARY KEY CLUSTERED
 (

  [Playlist_id]
 )
)
GO

/* no fk for 'PK_Ply_Pla_Mus_Ply', tableName='Playlist_musics_Music' table='null' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Ply_Pla_Mus_Ply]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [PK_Ply_Pla_Mus_Ply]
GO
CREATE TABLE [dbo].[Playlist_musics_Music] (
 [Playlist_id] [uniqueidentifier] NOT NULL,
 [Music_id] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Ply_Pla_Mus_Ply] PRIMARY KEY CLUSTERED
 (

  [Playlist_id],
  [Music_id]
 )
)
GO

