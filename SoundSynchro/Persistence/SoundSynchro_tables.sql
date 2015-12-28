/* CodeFluent Generated . TargetVersion:Default. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
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

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [PK_Mus_Mus_Mus]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Mus__tc]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [DF_Mus__tc]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Mus__tk]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [DF_Mus__tk]
GO
CREATE TABLE [dbo].[Music] (
 [Music_id] [uniqueidentifier] NOT NULL,
 [Music_title] [nvarchar] (256) NULL,
 [Music_file] [nvarchar] (256) NULL,
 [Music_thumbnail] [nvarchar] (256) NULL,
 [Music_date] [datetime] NULL,
 [Music_type] [int] NULL,
 [_trackLastWriteTime] [datetime] NOT NULL CONSTRAINT [DF_Mus__tc] DEFAULT (GETDATE()),
 [_trackCreationTime] [datetime] NOT NULL CONSTRAINT [DF_Mus__tk] DEFAULT (GETDATE()),
 [_trackLastWriteUser] [nvarchar] (64) NOT NULL,
 [_trackCreationUser] [nvarchar] (64) NOT NULL,
 [_rowVersion] [rowversion] NOT NULL,
 CONSTRAINT [PK_Mus_Mus_Mus] PRIMARY KEY NONCLUSTERED
 (

  [Music_id]
 ) ON [PRIMARY]
)
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [PK_Pla_Pla_Pla]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Pla__tc]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [DF_Pla__tc]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[DF_Pla__tk]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [DF_Pla__tk]
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
 CONSTRAINT [PK_Pla_Pla_Pla] PRIMARY KEY NONCLUSTERED
 (

  [Playlist_id]
 ) ON [PRIMARY]
)
GO

/* no fk for 'PK_Ply_Pla_Mus_Ply', tableName='Playlist_musics_Music' table='Playlist_musics_Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Ply_Pla_Mus_Ply]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [PK_Ply_Pla_Mus_Ply]
GO
CREATE TABLE [dbo].[Playlist_musics_Music] (
 [Playlist_id] [uniqueidentifier] NOT NULL,
 [Music_id] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Ply_Pla_Mus_Ply] PRIMARY KEY NONCLUSTERED
 (

  [Playlist_id],
  [Music_id]
 ) ON [PRIMARY]
)
GO

