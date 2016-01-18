/* CodeFluent Generated . TargetVersion:Sql2008, Sql2012, Sql2014, SqlAzure. Culture:en-US. UiCulture:en-US. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
/* no fk for 'PK_Mus_Mus_Mus', tableName='Music' table='null' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [PK_Mus_Mus_Mus]
GO
CREATE TABLE [dbo].[Music] (
 [Music_id] [uniqueidentifier] NOT NULL,
 [Music_title] [nvarchar] (256) NULL,
 [Music_file] [nvarchar] (256) NULL,
 [Music_thumbnail] [nvarchar] (256) NULL,
 [Music_date] [datetime] NULL,
 [Music_type] [int] NULL,
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

